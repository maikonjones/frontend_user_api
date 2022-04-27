const baseUrl = 'http://localhost:3000/'
const socket = io("http://localhost:3001/")
const userToken = localStorage.getItem('userToken')
const head = {
	headers: {
		Authorization: `Bearer ${ userToken }`
	}
}

let user, users
if (!userToken)
	location.href = '/'
else {
	axios.get(`${ baseUrl }userscrud/list`, head)
		.then((res) => {
			let userId = JSON.parse(atob(userToken.split('.')[1])).userId
			user = res.data.thisUsers.find(user => user._id == userId)
			headerUsername.textContent = user.name
			users = res.data.thisUsers.filter(user => user._id != userId)
			users.map(u => {
				usersList.innerHTML += `<li>${ u.name }</li>`
			})

		})
		.catch((err) => {
			console.log(err)
			alert(err.response.data.msg || err.response.data.error)
		})
}

function showAccountEditor() {
	accountEditorWrapper.style.display = 'block'
	username.value = user.name
	surname.value = user.surname
	cpf.value = user.cpf
	phone.value = user.phone
	password.value = ''
	confirmPassword.value = ''
}

function closeAccountEditor() {
	username.value = ''
	surname.value = ''
	cpf.value = ''
	phone.value = ''
	password.value = ''
	confirmPassword.value = ''
	accountEditorWrapper.style.display = 'none'
}

function editAccount() {
	axios.put(`${ baseUrl }userscrud/update`, {
		userId: user._id,
		name: username.value,
		surname: surname.value,
		cpf: cpf.value,
		phone: phone.value,
		password: password.value,
		confirmPassword: confirmPassword.value
	}, head)
		.then((res) => {
			console.log('res', res)
			headerUsername.textContent = username.value
			alert(res.data.msg)
			closeAccountEditor()
		})
		.catch((err) => {
			console.log('err', err)
			alert(err.response.data.msg || err.response.data.error)
		})
}

function delAccount() {
	if (confirm('Quer mesmo excluir sua conta?')) {
		axios.delete(`${ baseUrl }userscrud/remove?userId=${ user._id }`, head)
			.then((res) => {
				console.log(res)
				localStorage.removeItem('userToken')
				location.href = '/'
			})
	}
}

function logout() {
	if (confirm('Quer mesmo sair?')) {
		localStorage.removeItem('userToken')
		location.href = '/'
	}
}

function renderMessage(message) {
	chat.innerHTML += `<div class="message"><strong>${ message.author }</strong>: ${ message.message }</div>`
}

socket.on('previousMessages', (messages) => {
	messages.map((message) => {
		renderMessage(message)
	})
})

socket.on('receivedMessage', (message) => {
	renderMessage(message)
})

function sendMessage() {
	let msg = msgInput.value
	if (msg.trim().length) {
		let msgObj = {
			author: user.name,
			message: msg
		}
		renderMessage(msgObj)
		socket.emit('sendMessage', msgObj)
	}
}