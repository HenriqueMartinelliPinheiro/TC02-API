import axios, { AxiosInstance } from 'axios';

export class ApiService {
	public axiosInstance: AxiosInstance;

	constructor(baseURL: string) {
		this.axiosInstance = axios.create({
			baseURL,
			timeout: 10000,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
