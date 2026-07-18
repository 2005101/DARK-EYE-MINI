import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import fs from 'fs'
import gTTS from 'gtts'
import axios from 'axios'
import FormData from 'form-data'

let config = JSON.parse(fs.readFileSync('./config.json'))
const genAI = new GoogleGenerativeAI(config.apis.gemini_key)
const openai = new OpenAI({ apiKey: config.apis.openai_key })

const API = {
  // TEXT AI
  gpt4: async(p)=> {
    const res = await openai.chat.completions.create({model:"gpt-4o", messages:[{role:"user",content:p}]})
    return res.choices[0].message.content
  },
  gpt3: async(p)=> {
    const res = await openai.chat.completions.create({model:"gpt-3.5-turbo", messages:[{role:"user",content:p}]})
    return res.choices[0].message.content
  },
  gemini: async(p)=> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const res = await model.generateContent(p);
    return res.response.text()
  },
  claude: async(p)=> {
    const res = await axios.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [{role: "user", content: p}]
    }, { headers: { "x-api-key": config.apis.claude_key, "anthropic-version": "2023-06-01" }})
    return res.data.content[0].text
  },
  deepseek: async(p)=> {
    const res = await axios.post('https://api.deepseek.com/chat/completions', {
      model: "deepseek-chat", messages: [{role: "user", content: p}]
    }, { headers: { "Authorization": `Bearer ${config.apis.deepseek_key}` }})
    return res.data.choices[0].message.content
  },
  perplexity: async(p)=> {
    const res = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "llama-3.1-sonar-large-128k-online", messages: [{role: "user", content: p}]
    }, { headers: { "Authorization": `Bearer ${config.apis.perplexity_key}` }})
    return res.data.choices[0].message.content
  },

  // IMAGE AI
  imagine: async(p)=> {
    const res = await axios.post('https://cloud.leonardo.ai/api/rest/v1/generations', {
      prompt: p, modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3"
    }, { headers: { "Authorization": `Bearer ${config.apis.leonardo_key}` }})
    return `Image generation started. ID: ${res.data.sdGenerationJob.generationId}`
  },
  removebg: async(p, sock, m)=> {
    const form = new FormData();
    form.append('image_file', p);
    const res = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
      headers: {...form.getHeaders(), 'X-Api-Key': config.apis.remove_bg_key },
      responseType: 'arraybuffer'
    });
    return res.data
  },

  // AUDIO AI
  aisong: async(p)=> {
    const res = await axios.post('https://api.suno.ai/generate', { prompt: p },
    { headers: { "Authorization": `Bearer ${config.apis.suno_key}` }})
    return `Song generation: ${res.data.id}`
  },
  tts: async(p)=> {
    const tts = new gTTS(p, 'en');
    tts.save('./temp.mp3', ()=>{})
    return './temp.mp3'
  },

  // PLACEHOLDERS
  meta: async(p)=>`[LLAMA] ${p}`,
  grok: async(p)=>` ${p}`,
  sora: async(p)=>`[SORA VIDEO] ${p}`,
  code: async(p)=>`[CODE] ${p}`,
  grammer: async(p)=>`[FIXED] ${p}`
}
