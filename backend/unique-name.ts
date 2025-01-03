import { generateUsername } from "unique-username-generator";

const username = generateUsername("-", 4, 20);
console.log(username.length);
console.log(username);
