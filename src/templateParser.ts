import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

export class TemplateProcessor {
	private templates: { [name: string]: string } = {};

	constructor() {
		// Initialize the templates dictionary
		this.templates = {
			contract: path.join(__dirname, '../src/templates/contract_template.md'),
			confirmation: path.join(__dirname, '../src/templates/confirmation_template.md'),
		};
	}

	private async prompt(question: string): Promise<string> {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise<string>((resolve) => {
			rl.question(question, (answer) => {
				rl.close();
				resolve(answer);
			});
		});
	}

	public async populateTemplate(templateName: string): Promise<void> {
		const filePath = this.templates[templateName];

		if (!filePath || !fs.existsSync(filePath)) {
			console.error(`Template file not found for template name: ${templateName}`);
			return;
		}

		const content = fs.readFileSync(filePath, 'utf-8');
		const pattern = /\{\{(\w+\.\w+)\}\}/g;
		const matches = content.match(pattern);
		const argumentMap: { [key: string]: string | null } = {};

		if (matches) {
			matches.forEach((match) => {
				const key = match.slice(2, -2); // Remove the {{ and }}
				argumentMap[key] = null;
			});

			for (const key in argumentMap) {
				if (argumentMap.hasOwnProperty(key)) {
					const userValue = await this.prompt(`Please enter a value for ${key}: `);
					argumentMap[key] = userValue;
				}
			}

			let processedContent = content;
			for (const key in argumentMap) {
				if (argumentMap.hasOwnProperty(key)) {
					const value = argumentMap[key];
					const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
					processedContent = processedContent.replace(regex, value as string);
				}
			}

			fs.writeFileSync(path.join(__dirname, 'output.txt'), processedContent, 'utf-8');
			console.log('Template populated and written to output.txt');
		} else {
			console.log('No patterns found in the template file.');
		}
	}
}

// Example usage
// (async () => {
//   const processor = new TemplateProcessor();
//   await processor.populateTemplate('contract'); // or 'confirmation'
// })();
