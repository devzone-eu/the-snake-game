export {};

declare global {
    type Options = {
        sceneWidth: number,
        sceneHeight: number,
        blockSize: number,
    }

    type Scene = {
        sceneWidth: number,
        sceneHeight: number,
        title: string,
        key: string,
        dedicated: boolean,

        getTitle(): string,
        getKey(): string,
        setCanvasWidth(width: number): void,
        setCanvasHeight(height: number): void,
        drawUserInterface(canvas: HTMLCanvasElement, state: State): void,
        attachEventListeners(canvas: HTMLCanvasElement, state: State): void,
        resetDrawingContext(context: CanvasRenderingContext2D, x: number, y: number): void,
        setSceneTitle(context: CanvasRenderingContext2D, title: string, x: number, y: number): void,
    }

    type State = {
        options: Options,
        scenes: Array<Scene>,
        activeScene: string,

        getActiveScene(): Scene,
    }
}
