import { Observable } from "rxjs/Rx";
import { ajax } from "rxjs/observable/dom/ajax";

import * as chatroomActions from "./chatroomActions";
/*
// epic
export const fetchOlderMessageCount_Epic = action$ =>
    action$.ofType(chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS)
        .map(chatroomActions.checkOlderMessages); */