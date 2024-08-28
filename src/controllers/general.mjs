export async function greeting(req, res) {
    res.send('Hello world~');
};

export async function greetingName(req, res) {
    res.send(`Hello ${req.params.name}`);
}