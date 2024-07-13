#!/usr/bin/env node

import { Command, Option } from 'commander';
import { TemplateProcessor } from './templateParser';

const program = new Command();

program
	.name('Message Generator')
	.description('CLI to generate messages for Fiesta Freeze Rentals')
	.version('0.0.0');

program.command('split')
	.description('Split a string into substrings and display as an array')
	.argument('<string>', 'string to split')
	.option('--first', 'display just the first substring')
	.option('-s, --separator <char>', 'separator character', ',')
	.action((str, options) => {
		const limit = options.first ? 1 : undefined;
		console.log(str.split(options.separator, limit));
	});

program.command('template')
	.description('Populate a template file with data')
	.addOption(new Option('-n, --name <templateName>', 'template name').choices(['contract', 'confirmation']))
	.action((options) => {
		(async () => {
			const processor = new TemplateProcessor();
			await processor.populateTemplate(options.name); // or 'confirmation'
		})();
	});

program.parse();
