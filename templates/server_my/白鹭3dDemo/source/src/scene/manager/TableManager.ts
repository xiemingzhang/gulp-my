module egret3d {
    export class TableManager {

        public static instance: TableManager;

        private _upgradeTable: DictionaryTable<UpgradeItem>;
        private _unitTable: DictionaryTable<UnitItem>;
        private _waveTable: DictionaryTable<WaveItem>;
        private _sceneTable: DictionaryTable<SceneItem>;
        private _equipTable: DictionaryTable<EquipItem>;
        private _skillsTable: DictionaryTable<SkillsItem>;

        public constructor() {
            TableManager.instance = this;
        }

        private getConfig(tableName: string): any {
            return DictionaryTable.buildDictionaryTableFromJsonData(RES.getRes(tableName), "id");
        }

        public onInitialize(): boolean {
            this._upgradeTable = this.getConfig("table/upgrade.json");
            this._unitTable = this.getConfig("table/unit.json");
            this._waveTable = this.getConfig("table/wave.json");
            this._sceneTable = this.getConfig("table/scene.json");
            this._equipTable = this.getConfig("table/equip.json");
            this._skillsTable = this.getConfig("table/skills.json");
            return true;
        }

        public static findUpgradeTableItem(key: number): UpgradeItem {
            return TableManager.instance._upgradeTable.findTableItem(key);
        }

        public static findUnitTableItem(key: number): UnitItem {
            return TableManager.instance._unitTable.findTableItem(key);
        }

        public static findWaveTableItem(key: number): WaveItem {
            return TableManager.instance._waveTable.findTableItem(key);
        }

        public static findSceneTableItem(key: number): SceneItem {
            return TableManager.instance._sceneTable.findTableItem(key);
        }

        public static findEquipTableItem(key: number): EquipItem {
            return TableManager.instance._equipTable.findTableItem(key);
        }

        public static findSkillsTableItem(key: number): SkillsItem {
            return TableManager.instance._skillsTable.findTableItem(key);
        }

        public static getSceneTableItemKeys(): string[] {

            return TableManager.instance._sceneTable.getAllKeys();
        }
    }

    export class DictionaryTable<T> {

        private _tables: { [id: string]: T } = {};

        public findTableItem(keyValue: any/*, ...keyValues: any[]*/): T {
            return this._tables[keyValue];
        }

        public getAllKeys(): any {
            var keys: string[] = [];
            for (var id in this._tables) {
                keys.push(id);
            }
            return keys;
        }

        public static buildDictionaryTableFromJsonData<T>(json: any, keyName: string): DictionaryTable<T> {

            var dictionary: DictionaryTable<T> = new DictionaryTable<T>();

            var node: any = null;

            for (var i: number = 0; i < json.root.length; i++) {

                node = json.root[i];

                dictionary._tables[node[keyName]] = node;
            }

            return dictionary;
        }
    }
}