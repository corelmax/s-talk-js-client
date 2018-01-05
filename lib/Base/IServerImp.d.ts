export interface IServerImp {
    dispose: () => void;
    disConnect: (callback?: () => void) => void;
}
