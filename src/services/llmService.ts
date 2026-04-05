import * as vscode from "vscode";
import { getSystemPrompt } from "../prompts/system.js";
import { getExamplesForProvider } from "../prompts/examples.js";

export class LlmService {
  async generateDiagramXml(
    description: string,
    provider: string,
    token: vscode.CancellationToken
  ): Promise<string> {
    const models = await vscode.lm.selectChatModels({ vendor: "copilot" });

    if (models.length === 0) {
      throw new Error(
        "GitHub Copilot is required for AI diagram generation. Please install and sign in to GitHub Copilot."
      );
    }

    const model = models[0];
    const systemPrompt = getSystemPrompt(provider);
    const examples = getExamplesForProvider(provider);

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(systemPrompt),
    ];

    // Add few-shot examples
    for (const example of examples) {
      messages.push(
        vscode.LanguageModelChatMessage.User(
          `Generate a diagram for: ${example.description}`
        )
      );
      messages.push(
        vscode.LanguageModelChatMessage.Assistant(example.xml)
      );
    }

    // Add the actual user request
    messages.push(
      vscode.LanguageModelChatMessage.User(
        `Generate a diagram for: ${description}`
      )
    );

    const response = await model.sendRequest(messages, {}, token);

    let fullResponse = "";
    for await (const chunk of response.text) {
      fullResponse += chunk;
    }

    const xml = this.extractXml(fullResponse);
    this.validateXml(xml);
    return xml;
  }

  private extractXml(response: string): string {
    // Try to extract XML between mxGraphModel tags
    const match = response.match(
      /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
    );
    if (match) {
      return match[0];
    }

    // If the response starts with the XML declaration or mxGraphModel, use it directly
    const trimmed = response.trim();
    if (
      trimmed.startsWith("<mxGraphModel") ||
      trimmed.startsWith("<?xml")
    ) {
      return trimmed;
    }

    // Try to strip markdown code fences
    const fenceMatch = response.match(
      /```(?:xml)?\s*([\s\S]*?)```/
    );
    if (fenceMatch) {
      const inner = fenceMatch[1].trim();
      const innerMatch = inner.match(
        /<mxGraphModel[\s\S]*?<\/mxGraphModel>/
      );
      if (innerMatch) {
        return innerMatch[0];
      }
      return inner;
    }

    throw new Error(
      "Could not extract valid mxGraph XML from AI response. Please try again with a clearer description."
    );
  }

  private validateXml(xml: string): void {
    if (!xml.includes("<mxGraphModel")) {
      throw new Error("Response does not contain a valid mxGraphModel element.");
    }
    if (!xml.includes("</mxGraphModel>")) {
      throw new Error("Response contains incomplete mxGraphModel XML.");
    }
    if (!xml.includes("<root>") || !xml.includes("</root>")) {
      throw new Error("Response does not contain a valid root element.");
    }
    if (!xml.includes('<mxCell id="0"')) {
      throw new Error('Response is missing required mxCell id="0".');
    }
  }
}
