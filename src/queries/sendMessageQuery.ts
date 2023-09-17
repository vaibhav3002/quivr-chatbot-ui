import { MessageType } from '@/components/Bot'
import { sendRequest } from '@/utils/index'

export type IncomingInput = {
    question: string
    history: MessageType[]
    overrideConfig?: Record<string, unknown>
    socketIOClientId?: string
}

export type MessageRequest = {
    chatflowid: string
    apiHost?: string
    body: IncomingInput
}

export const sendMessageQuery = ({ chatflowid, apiHost = 'http://localhost:3000', body }: MessageRequest) =>
    /*
    sendRequest<any>({
        method: 'POST',
        url: `${apiHost}/api/v1/prediction/${chatflowid}`,
        body
    })
    */
    send_request(chatflowid, apiHost, body)


export const isStreamAvailableQuery = ({ chatflowid, apiHost = 'http://localhost:3000' }: MessageRequest) =>
    sendRequest<any>({
        method: 'GET',
        url: `${apiHost}/api/v1/chatflows-streaming/${chatflowid}`,
    })

async function send_request(chatflowid: string, apiHost: string, body: IncomingInput) {

    const url = `${apiHost}/chat/${chatflowid}/question?brain_id=${body.overrideConfig?.brainId}`;
    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${body.overrideConfig?.authToken}`,
        'Content-Type': 'application/json'
    };
    const data = {
        question: body.question,
        prompt_id: body.overrideConfig?.prompt_id,
        temperature: body.overrideConfig?.temperature,
        model: body.overrideConfig?.model,
        max_tokens: body.overrideConfig?.max_tokens
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();

        return { data: responseData, error: undefined };

    } catch (error) {
        throw { data: undefined, error: new Error(`Error asking question`) };
    }
}
