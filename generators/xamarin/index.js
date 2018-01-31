const path = require('path');
const mkdirp = require('mkdirp');
const uuidV4 = require('uuid/v4');
const args = require(`../app/args`);
const util = require(`../app/utility`);
const prompts = require(`../app/prompt`);
const generators = require('yeoman-generator');

function construct() {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    // Order is important
    args.applicationName(this);
    args.packageName(this);
}

function input() {
    // Collect any missing data from the user.
    // This gives me access to the generator in the
    // when callbacks of prompt
    let cmdLnInput = this;

    return this.prompt([
        prompts.applicationName(this),
        prompts.packageName(this)
    ]).then(function (a) {
        // Transfer answers to local object for use in the rest of the generator
        this.applicationName = util.reconcileValue(a.applicationName, cmdLnInput.applicationName);
        this.packageName = util.reconcileValue(a.packageName, cmdLnInput.packageName);
    }.bind(this));
}

function writeFiles() {

    var tokens = {
        name: this.applicationName,
        uuid1: uuidV4(),
        uuid2: uuidV4(),
        uuid3: uuidV4(),
        name_lowercase: this.applicationName.toLowerCase(),
        package_name: this.packageName
    };

    var src = this.sourceRoot();
    var root = this.applicationName;

    // Root files
    this.fs.copyTpl(`${src}/XamarinNativeTemplate.sln`, `${root}/${this.applicationName}.sln`, tokens);
    this.fs.copyTpl(`${src}/README.md`, `${root}/README.md`, tokens);
    this.copy(`${src}/gitignore`, `${root}/.gitignore`);

// .Net Standard project
    src = `${this.sourceRoot()}/XamarinNativeTemplate`;
    root = `${this.applicationName}/${this.applicationName}`;

    // Root Net Standard project files
    this.fs.copyTpl(`${src}/XamarinNativeTemplate.csproj`, `${root}/${this.applicationName}.csproj`, tokens);

    // Properties .Net Standard files
    this.fs.copyTpl(`${src}/Properties/AssemblyInfo.cs`, `${root}/Properties/AssemblyInfo.cs`, tokens);

// Droid project
    src = `${this.sourceRoot()}/Droid`;
    root = `${this.applicationName}/Droid`;

    // Root Droid files
    this.fs.copyTpl(`${src}/MainActivity.cs`, `${root}/MainActivity.cs`, tokens);
    this.fs.copyTpl(`${src}/XamarinNativeTemplate.Droid.csproj`, `${root}/${this.applicationName}.Droid.csproj`, tokens);

    // Properties Droid files
    this.fs.copyTpl(`${src}/Properties/AndroidManifest.xml`, `${root}/Properties/AndroidManifest.xml`, tokens);
    this.fs.copyTpl(`${src}/Properties/AssemblyInfo.cs`, `${root}/Properties/AssemblyInfo.cs`, tokens);

    // Ressources Droid files
    this.fs.copyTpl(`${src}/Resources/Resource.designer.cs`, `${root}/Resources/Resource.designer.cs`, tokens);
    this.directory(`${src}/Resources/layout`, `${root}/Resources/layout`);
    this.directory(`${src}/Resources/mipmap-hdpi`, `${root}/Resources/mipmap-hdpi`);
    this.directory(`${src}/Resources/mipmap-mdpi`, `${root}/Resources/mipmap-mdpi`);
    this.directory(`${src}/Resources/mipmap-xhdpi`, `${root}/Resources/mipmap-xhdpi`);
    this.directory(`${src}/Resources/mipmap-xxhdpi`, `${root}/Resources/mipmap-xxhdpi`);
    this.directory(`${src}/Resources/mipmap-xxxhdpi`, `${root}/Resources/mipmap-xxxhdpi`);
    this.fs.copyTpl(`${src}/Resources/values/Strings.xml`, `${root}/Resources/values/Strings.xml`, tokens);
    this.copy(`${src}/Resources/AboutResources.txt`, `${root}/Resources/AboutResources.txt`);

    // Assets Droid files
    this.directory(`${src}/Assets`, `${root}/Assets`);

// iOS project
    src = `${this.sourceRoot()}/iOS`;
    root = `${this.applicationName}/iOS`;

    // Root iOS files
    this.fs.copyTpl(`${src}/AppDelegate.cs`, `${root}/AppDelegate.cs`, tokens);
    this.fs.copyTpl(`${src}/Info.plist`, `${root}/Info.plist`, tokens);
    this.fs.copyTpl(`${src}/Main.cs`, `${root}/Main.cs`, tokens);
    this.fs.copyTpl(`${src}/XamarinNativeTemplate.iOS.csproj`, `${root}/${this.applicationName}.iOS.csproj`, tokens);
    this.fs.copyTpl(`${src}/ViewController.cs`, `${root}/ViewController.cs`, tokens);
    this.fs.copyTpl(`${src}/ViewController.designer.cs`, `${root}/ViewController.designer.cs`, tokens);
    this.copy(`${src}/Entitlements.plist`, `${root}/Entitlements.plist`);
    this.copy(`${src}/LaunchScreen.storyboard`, `${root}/LaunchScreen.storyboard`);
    this.copy(`${src}/Main.storyboard`, `${root}/Main.storyboard`);

    // Assets iOS files
    this.directory(`${src}/Assets.xcassets`, `${root}/Assets.xcassets`);

    // Ressources iOS files
    this.directory(`${src}/Ressources`, `${root}/Ressources`);
}

module.exports = generators.Base.extend({
    // The name `constructor` is important here
    constructor: construct,

    // 2. Where you prompt users for options (where you'd call this.prompt())
    prompting: input,

    // 5. Where you write the generator specific files (routes, controllers, etc)
    writing: writeFiles
});