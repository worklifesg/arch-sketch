import * as vscode from "vscode";
import { getSystemPrompt } from "../prompts/system.js";

export class RefinementService {
  async refineDiagram(
    currentXml: string,
    instruction: string,
    provider: string,
    token: vscode.CancellationToken
  ): Promise<string> {
    const models = await vscode.lm.selectChatModels({ vendor: "copilot" });

    if (models.length === 0) {
      throw new Error(
        "GitHub Copilot is required. Please install and sign in."
      );
    }

    const model = models[0];
    const systemPrompt = getSystemPrompt(provider);

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
      vscode.LanguageModelChatMessage.User(
        `Here is the current diagram XML:\n\n${currentXml}`
      ),
      vscode.LanguageModelChatMessage.Assistant(
        "I see the current diagram. What changes would you like?"
      ),
      vscode.LanguageModelChatMessage.User(
        `Modify the diagram according to this instruction: ${instruction}\n\nOutput the COMPLETE updated mxGraph XML with the changes applied. Keep all existing elements unless the instruction says to remove them.`
      ),
    ];

    const response = await model.sendRequest(messages, {}, token);

    let fullResponse = "";
    for await (const chunk of response.text) {
      fullResponse += chunk;
    }

    return this.extractXml(fullResponse);
  }

  private extractXml(response: string): string {
    const match = response.match(
      /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
    );
    if (match) {
      return match[0];
    }

    const fenceMatch = response.match(/```(?:xml)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      const inner = fenceMatch[1].trim();
      const innerMatch = inner.match(
        /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
      );
      if (innerMatch) {
        return innerMatch[0];
      }
    }

    throw new Error(
      "Could not extract valid mxGraph XML from the refinement response."
    );
  }
}
