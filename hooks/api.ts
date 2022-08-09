import {
  MovementDirection,
  MovementResult,
} from "components/interfaces/movement";

const basePath = "/api/";

interface ApiResponseNewGame {
  id: string;
}

interface ApiResponseMove {
  movementResult: MovementResult;
}

type ApiExecuteFunction<T> = (...args: any[]) => Promise<T>;

interface ApiFunctions {
  newGame: ApiExecuteFunction<ApiResponseNewGame>;
  move: ApiExecuteFunction<ApiResponseMove>;
}

const execute = <T>(
  path: string,
  method: string,
  data?: Record<string, unknown>
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch(`${basePath}${path}`, {
      method: method.toUpperCase(),
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: !["GET", "HEAD"].includes(method.toUpperCase())
        ? JSON.stringify(typeof data === "object" ? data : {})
        : undefined,
    })
      .then(async (res: Response) => await res.json())
      .then((json) => {
        resolve(json);
      })
      .catch(reject);
  });
};

export const api: ApiFunctions = {
  newGame: async () => execute<ApiResponseNewGame>("newgame", "POST"),
  move: async (sessionId: string | null, direction: MovementDirection) =>
    execute<ApiResponseMove>("move", "POST", { sessionId, direction }),
};

export default api;
