import { app } from "./app";

const port  = process.env.PORT || 8888;

app.listen(port, async () => {
    console.log(`Backend listening at http://localhost:${port}`);
}
);

module.exports = app;
