interface Page extends egret.DisplayObject {

    onEnterPage?: () => void;

    onLeavePage?: () => void;
}


class UIManager {

    private container: egret.DisplayObjectContainer;
    private loginPage: LoginPage;
    private roomPage: RoomPage;
    private battlePage: BattlePage;
    private endingPage: EndingPage;
    private loadingPage: LoadingPage;

    public static gameWidth = 0;

    public static gameHeight = 0;

    private currentPage: Page;

    constructor(container: egret.DisplayObjectContainer) {
        this.container = container;

        UIManager.gameWidth = container.stage.stageWidth;
        UIManager.gameHeight = container.stage.stageHeight;
    }

    showPage(page: Page) {
        this.removePage();
        this.currentPage = page;
        this.container.addChild(page);
        if (page.onEnterPage) {
            page.onEnterPage();
        }
    }

    removePage() {
        if (this.currentPage) {
            if (this.currentPage.onLeavePage) {
                this.currentPage.onLeavePage();
            }
            this.container.removeChild(this.currentPage);
            this.currentPage = null;
        }
    }


    showBattle(): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.onEnterPage();
        this.container.addChild(this.battlePage);
    }

    updateBattle(time: number, delay: number): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.update(time, delay);
    }

    blood(target: egret3d.GameActor, num: number): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.blood(target, num);
    }

    addHpBar(target: egret3d.GameActor, hpBar: egret.DisplayObject): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.addHpBar(target, hpBar);
    }

    startTimeKeeper(): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.timeKeeper.start();
    }

    stopTimeKeeper(): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.timeKeeper.stop();
    }

    hits(): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.hitContainer.hits();
    }

    updateExpBar(ratio: number): void {
        if (!this.battlePage) {
            this.battlePage = new BattlePage();
        }
        this.battlePage.expBar.ratio = ratio;
    }

    leaveBattle(): void {
        this.battlePage.onLeavePage();
        this.container.removeChild(this.battlePage);
    }

    showEnding(): void {
        if (!this.endingPage) {
            this.endingPage = new EndingPage();
        }

        this.endingPage.x = (UIManager.gameWidth - this.endingPage.width) / 2;
        this.endingPage.y = (UIManager.gameHeight - this.endingPage.height) / 2;
        this.container.addChild(this.endingPage);
    }

    leaveEnding(): void {
        this.container.removeChild(this.endingPage);
    }
}

let uiManager: UIManager;