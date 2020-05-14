import * as React from 'react';
import { Fetcher } from '../../types';
import { SessionState } from '../types';
import { SessionAction } from '../actions/sessionActions';
export declare type SessionReducer = React.Reducer<SessionState, SessionAction>;
export interface SessionHandlers {
    changeOperation: (operation: string) => void;
    changeVariables: (variables: string) => void;
    changeTab: (pane: string, tabId: number) => void;
    executeOperation: (operationName?: string) => Promise<void>;
    operationError: (error: Error) => void;
    dispatch: React.Dispatch<SessionAction>;
}
export declare const initialState: SessionState;
export declare const initialContextState: SessionState & SessionHandlers;
export declare const SessionContext: React.Context<SessionState & SessionHandlers>;
export declare const useSessionContext: () => SessionState & SessionHandlers;
export declare type SessionProviderProps = {
    sessionId: number;
    fetcher: Fetcher;
    session?: SessionState;
    children: React.ReactNode;
};
export declare function SessionProvider({ sessionId, fetcher, session, children, }: SessionProviderProps): JSX.Element;
//# sourceMappingURL=GraphiQLSessionProvider.d.ts.map