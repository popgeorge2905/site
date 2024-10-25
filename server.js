const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // bcrypt

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/aplicatie', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
}));

const Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    content: String,
}));

// Creare cont
app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash parola

    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Eroare la crearea utilizatorului', error });
    }
});

// Conectare utilizator
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Email sau parolă greșite!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // Compară parola hash-uită
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Email sau parolă greșite!' });
        }

        res.send({ message: 'Conectare reușită!' });
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        res.status(500).send({ message: 'Eroare la autentificare' });
    }
});

// Endpoint-uri pentru postări
app.post('/api/posts', async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
});

app.put('/api/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(post);
});

app.delete('/api/posts/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send({ message: 'Post deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});
