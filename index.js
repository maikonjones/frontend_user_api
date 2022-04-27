const baseUrl = 'http://192.168.100.100:3000/'

function login() {
	axios.post(`${ baseUrl }userscrud/authenticate`, {
		cpf: loginCpf.value,
		password: loginPassword.value
	})
		.then((res) => {
			localStorage.setItem('userToken', res.data.userToken)
			// alert(res.data.msg)
			location.href = 'chat.html'
		})
		.catch((err) => {
			alert(err.response.data.msg)
		})
}

function signup() {
	axios.post(`${ baseUrl }userscrud/register`, {
		name: username.value,
		surname: surname.value,
		phone: phone.value,
		cpf: signupCpf.value,
		password: signupPassword.value,
		confirmPassword: confirmPassword.value
	})
		.then((res) => {
			console.log('Cadastro efetuado com sucesso', res)
			alert('Cadastro efetuado com sucesso')
		})
		.catch((err) => {
			alert(err.response.data.msg)
		})
}

function setMask(id) {
	switch (id) {
		case 'loginCpf':
		case 'signupCpf':
			let input = document.getElementById(id)
			input.maxLength = 14
			input.value = input.value.replace(/\D/g, '')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1-$2')
			break
		case 'phone':
			phone.maxLength = 14
			phone.value = phone.value.replace(/\D/g, '')
				.replace(/(\d{2})(\d)/, '($1)$2')
				.replace(/(\d{5})(\d)/, '$1-$2')
			break
	}
}