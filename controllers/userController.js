const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.User;

const addUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(409).json({ message: 'Email deja folosit de catre un utilizator' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let info = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            number: req.body.number,
            password: hashedPassword,
            birthDate: req.body.birthDate,
        };

        const user = await User.create(info);

        res.status(200).send({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            number: user.number,
            birthDate: user.birthDate,
        });
        console.log(user);
    } catch (error) {
        console.error('Eroare la inregistrarea utilizatorului:', error);
        res.status(500).json({ message: 'Eroare la inregistrarea utilizatorului', error: error.message });
    }
};

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ message: `Utilizatorul cu emailul ${email} nu a fost gasit` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Parola incorecta' });
        }

        res.status(200).json({ message: 'Autentificat cu succes!' });
    } catch (error) {
        console.error('Eroare la autentificarea utilizatorului:', error);
        res.status(500).json({ message: 'Eroare la autentificarea utilizatorului', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        let email = req.params.email;
        let user = await User.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'lastName', 'email', 'number', 'birthDate']
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul cu acest email nu a fost gasit.' });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error('Eroare la gasirea utilizatorului: ', error);
        res.status(500).json({ message: 'Eroare la gasirea utilizatorului:', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.user.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la obtinerea utilizatorilor' });
    }
};


module.exports = {
    addUser,
    authenticateUser,
    getUser,
    getAllUsers
};
