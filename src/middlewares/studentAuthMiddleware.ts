import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const verifyHttpOnlyTokenMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies?.httpOnlyToken;

		if (!token) {
			return res.status(401).json({ error: 'Token não fornecido.' });
		}

		let decodedToken;
		try {
			decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		} catch (err) {
			return res.status(401).json({ error: 'Token inválido.' });
		}

		const studentLogin = await prisma.studentLogin.findUnique({
			where: {
				studentCpf: decodedToken.studentCpf,
			},
		});

		if (!studentLogin) {
			return res
				.status(401)
				.json({ error: 'Estudante não encontrado no banco de dados.' });
		}

		if (
			studentLogin.accessTokenExpiration &&
			studentLogin.accessTokenExpiration < new Date()
		) {
			return res.status(401).json({ error: 'Token expirado.' });
		}

		req.studentCpf = studentLogin.studentCpf;
		next();
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erro interno no servidor.' });
	}
};

export default verifyHttpOnlyTokenMiddleware;
