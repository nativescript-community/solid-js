import { aliasTagName, register } from 'dominative'

register(global)

aliasTagName(tag => tag.toLowerCase())