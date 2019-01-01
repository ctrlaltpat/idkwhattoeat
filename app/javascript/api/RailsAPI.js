class API {
  static signin (user) {
    const csrfToken = document.querySelector('[name="csrf-token"]').content
    return fetch('/api/v1/signin', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken},
      body: JSON.stringify(user)
    }).then(resp => resp.json())
  }
  static signup (user) {
    const csrfToken = document.querySelector('[name="csrf-token"]').content
    return fetch('/api/v1/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken},
      body: JSON.stringify(user)
    }).then(resp => resp.json())
  }
  static validate () {
    return this.get('/api/v1/validate')
  }
  static get (url) {
    return fetch(url, {
      headers: {
        'Authorization': localStorage.getItem('token')
      },
    }).then(resp => resp.json())
  }
  static updateSettings (settings) {
    const csrfToken = document.querySelector('[name="csrf-token"]').content
    return fetch('/api/v1/updateSettings', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken},
      body: JSON.stringify(settings)
    }).then(resp => resp.json())
  }
}

export default API