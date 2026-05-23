import "dotenv/config";
import experss from "express";
import cors from "cors";

const app = experss();
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.PUBLIC_URL
}));


app.use(experss.json());

app.get("/test", (req,res)=> {
    return res.status(200).json({
        message: "API is working"
    })
});


app.listen(PORT, ()=> {
    console.log(`Server listening on http://localhost:${PORT}`)
})

