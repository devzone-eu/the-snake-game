export {};

declare global {
    type Options = {
        sceneWidth: number,
        sceneHeight: number,
        blockSize: number,
    }

    type Scene = {
        dedicated: boolean,

        getTitle(): string,
        getKey(): string,
        setSceneWidth(width: number): void,
        setSceneHeight(height: number): void,
        drawUserInterface(canvas: HTMLCanvasElement, state: State): void,
        attachEventListeners(canvas: HTMLCanvasElement, state: State): void,
        resetDrawingContext(context: CanvasRenderingContext2D): void,
        setSceneTitle(context: CanvasRenderingContext2D, title: string, x: number, y: number): void,
    }

    type State = {
        options: Options,
        scenes: Array<Scene>,
        activeScene: string,

        getActiveScene(): Scene,
    }
}