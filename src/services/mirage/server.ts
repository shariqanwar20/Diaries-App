import { Response, Server, hasMany, belongsTo, Factory, Model } from "miragejs";
import * as user from "./routes/user";
import * as diary from "./routes/diary";

export const handleErrors = (error: any, message = "An error has occured") => {
  return new Response(400, undefined, {
    data: {
      message,
      isError: true,
    },
  });
};

export const setupServer = (env?: string): Server => {
  return new Server({
    environment: env ?? "development",
    models: {
      entry: Model.extend({
        diary: belongsTo(),
      }),
      diary: Model.extend({
        user: belongsTo(),
        entry: hasMany(),
      }),
      user: Model.extend({
        diary: hasMany(),
      }),
    },
    factories: {
      user: Factory.extend({
        username: "test",
        password: "password",
        email: "test@gmail.com",
      }),
    },
    seeds: (server: any) => {
      server.create("user");
    },
    routes(): void {
      this.urlPrefix = "https://diaries.app";

      this.get("/diaries/entries/:id", diary.getEntries);
      this.get("/diaries/:id", diary.getDiaries);

      this.post("/auth/login", user.logIn);
      this.post("/auth/signup", user.signUp);

      this.post("/diaries/", diary.create);
      this.post("/diaries/entry/:id", diary.addEntry);

      this.put("/diaries/:id", diary.updateDiary);
      this.put("/diaries/entry/:id", diary.updateEntry);
    },
  });
};
