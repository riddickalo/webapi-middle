#!/usr/bin/env node
import { middle_app } from "../../app.mjs";
import { createServer } from "http";

const server = createServer(middle_app);