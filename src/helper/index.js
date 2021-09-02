// const baseUri = "https://kosovo.chmzho.com/"
const baseUri = "http://127.0.0.1:9500/"

const baseFetchGet = (action, params = {}) => {
    if (params) {
        action = action + "?"
        for (const key in params) {
            action += `${key}=${params[key]}&`
        }
        action = action.substr(0, action.length - 1)
    }
    const token = localStorage.getItem("token") || ""
    return new Promise((resolve, reject) => {
        fetch(baseUri + action, {
            headers: {"token": token},
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                return resolve(data)
            }).catch(error => {
            return reject(error)
        })
    })
}

const baseFetchPost = (action, data) => {
    const token = localStorage.getItem("token") || ""
    return new Promise((resolve, reject) => {
        fetch(baseUri + action, {
            body: JSON.stringify(data),
            headers: {
                'content-type': "application/json",
                "token": token
            },
            method: "POST",
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                return resolve(data)
            }).catch(error => {
            return reject(error)
        })
    })
}


export default {
    baseFetchGet,
    baseFetchPost
}