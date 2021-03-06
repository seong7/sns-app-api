require("dotenv").config({ path: "../.env" });

import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import mongoose from "mongoose";

import api from "./api";
import jwtMiddleware from "./lib/jwtMiddleware";

const { PORT, MONGO_URI } = process.env;
const app = new Koa();
const router = new Router();

// 라우터 설정
router.use("/api", api.routes());

// 라우터 적용 전에 미들웨어 적용 (서버에 요청 시 무조건 실행됨)
app.use(cors());
app.use(bodyParser());
app.use(jwtMiddleware);

// 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// mongoose 연결
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to MongoDB");
  })
  .catch((e) => {
    console.error(e);
  });

const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listening to port %d", port);
});
