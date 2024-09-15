import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { text } from "stream/consumers";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "palette",
			name: "Display Palette",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.createColorView(editor);
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//this function will create the color view
	createColorView(editor: Editor) {
		let colors: { color: string; type: string }[] = [];
		editor
			.getSelection()
			.split(" ")
			.forEach((word) => {
				const parsed = this.parse_color(word);
				if (parsed != undefined) colors.push(parsed);
			});
		let divs =
			'<div class="main" style="height:' +
			Math.ceil(colors.length / 4) * 100 +
			'px">';
		for (let i = 0; i < colors.length; i++) {
			divs +=
				'<div class="color_container ' +
				colors[i].type +
				'" style="background-color:#' +
				colors[i].color.toUpperCase() +
				'">' +
				colors[i].color.toUpperCase() +
				" </div>";
		}
		divs += "</div>";
		editor.replaceSelection(divs);
	}

	parse_color(color: string) {
		let colorSpec = color.split("#");
		if (color == "") {
			return;
		}
		if (colorSpec[1] != undefined) {
			colorSpec[1] = colorSpec[1].toLowerCase();
		} else {
			colorSpec[1] = "dark";
		}

		return {
			color: colorSpec[0],
			type: colorSpec[1],
		};
	}
}
