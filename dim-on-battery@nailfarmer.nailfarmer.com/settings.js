const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const SCHEMA_PATH = 'org.gnome.shell.extensions.dim-on-battery';

function get_local_gsettings(schema_path) {
	const GioSSS = Gio.SettingsSchemaSource;

	let schemaDir = Extension.dir.get_child('schemas');
	let schemaSource = GioSSS.new_from_directory(
		schemaDir.get_path(),
		GioSSS.get_default(),
		false);
        if (!schemaSource) {
		throw new Error(
			'Schema directory ' + schemaDir.get_path() +
			' could not be found for extension ' +
			Extension.metadata.uuid
		);
	}
	let schemaObj = schemaSource.lookup(schema_path, true);
	if (!schemaObj) {
		throw new Error(
			'Schema ' + schema_path +
			' could not be found for extension ' +
			Extension.metadata.uuid
		);
	}
	return new Gio.Settings({ settings_schema: schemaObj });
};

function Prefs() {
	var self = this;
	var settings = this.settings = get_local_gsettings(SCHEMA_PATH);
	this.BATTERY_BRIGHTNESS = {
		key: 'battery-brightness',
		get: function() { return settings.get_double(this.key); },
		set: function(v) { settings.set_double(this.key, v); },
		changed: function(cb) { return settings.connect('changed::' + this.key, cb); },
		disconnect: function() { return settings.disconnect.apply(settings, arguments); },
	};
	this.AC_BRIGHTNESS = {
		key: 'ac-brightness',
		get: function() { return settings.get_double(this.key); },
		set: function(v) { settings.set_double(this.key, v); },
		changed: function(cb) { return settings.connect('changed::' + this.key, cb); },
		disconnect: function() { return settings.disconnect.apply(settings, arguments); },
	};
};
