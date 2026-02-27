import fs from "fs";
const fileContent = fs.readFileSync("../backend/src/main/resources/application.properties", "utf-8");
let backendProps = {};
fileContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) backendProps[parts[0].trim()] = parts.slice(1).join("=").trim();
});
console.log(backendProps["micronaut.server.context-path"]);
