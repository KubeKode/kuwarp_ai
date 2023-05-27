import kuwarp from './assets/KUWARP.gif'
import user from './assets/bgr.jpg'

const form = document.querySelector('#kuwarp-form')
const chatContainer = document.querySelector('#message_container')

let messageInter; 

function loader(element) {
    element.textContent = ''

    messageInter = setInterval(() => {
      
        element.textContent += '🤔';

      
        if (element.textContent === '🤔🤔🤔🤔') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0
   

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}


function generateuniReq() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniReq) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                    class="chatbot"
                      src=${isAi ?  kuwarp : user} 
                      alt="${isAi ? 'kuwarp' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniReq}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)


    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))


    form.reset()

   
    const uniReq = generateuniReq()
    chatContainer.innerHTML += chatStripe(true, " ", uniReq)

    chatContainer.scrollTop = chatContainer.scrollHeight;

  
    const messageWindow = document.getElementById(uniReq)

   
    loader(messageWindow)

    const response = await fetch('https://kubekode-aervice.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(messageInter)
    messageWindow.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.kuwarp.trim()  

        typeText(messageWindow, parsedData)
    } else {
        const err = await response.text()

        messageWindow.innerHTML = "I think you need to try something new";
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})