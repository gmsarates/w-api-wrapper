const axios = require('axios');

/**
 * W-API WhatsApp API Client
 * A wrapper for the W-API WhatsApp API
 */
class WApiClient {
  /**
   * Create a new W-API client
   * @param {string} apiKey - Your W-API API key
   * @param {string} instanceId - Your W-API instance ID
   * @param {string} baseUrl - The base URL for the API (default: https://api.w-api.app)
   */
  constructor(apiKey, instanceId, baseUrl = 'https://api.w-api.app') {
    if (!apiKey) throw new Error('API key is required');
    if (!instanceId) throw new Error('Instance ID is required');

    this.apiKey = apiKey;
    this.instanceId = instanceId;
    this.baseUrl = baseUrl;
    
    this.http = axios.create({
      baseURL: this.baseUrl,
      params: { instanceId: this.instanceId },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }

  /**
   * Get instance information
   * @returns {Promise} - Instance information
   */
  async getInstance() {
    try {
      const response = await this.http.get('/v1/instance/fetch-instance');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Restart the instance
   * @returns {Promise} - Instance restart result
   */
  async restartInstance() {
    try {
      const response = await this.http.get('/v1/instance/restart');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get instance QR code
   * @returns {Promise} - QR code data
   */
  async getQrCode() {
    try {
      const response = await this.http.get('/v1/instance/qr-code');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Logout from the instance
   * @returns {Promise} - Logout result
   */
  async logout() {
    try {
      const response = await this.http.get('/v1/instance/disconnect');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a text message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} body - Message text
   * @returns {Promise} - Message send result
   */
  async sendTextMessage(to, body) {
    try {
      const data = { phone: to, message: body };
      const response = await this.http.post('/v1/message/send-text', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send an image message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} caption - Image caption
   * @param {string} url - Image URL
   * @returns {Promise} - Message send result
   */
  async sendImageMessage(to, caption, url) {
    try {
      const data = { phone: to, image: url, caption };
      const response = await this.http.post('/v1/message/send-image', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a file message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} caption - File caption
   * @param {string} url - File URL
   * @param {string} [extension] - File extension without dot (default: inferred from the URL)
   * @param {string} [fileName] - File name
   * @returns {Promise} - Message send result
   */
  async sendFileMessage(to, caption, url, extension, fileName) {
    try {
      const inferred = url.split(/[?#]/)[0].split('.').pop();
      const data = { phone: to, document: url, extension: extension || inferred, fileName, caption };
      const response = await this.http.post('/v1/message/send-document', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a button message
   * @param {string} to - Phone number in format 5511999999999@c.us
   * @param {string} title - Message title
   * @param {string} description - Message description
   * @param {Array} buttons - Array of button objects with id and text
   * @param {string} footer - Message footer
   * @returns {Promise} - Message send result
   */
  async sendButtonMessage(to, title, description, buttons, footer = '') {
    try {
      const data = {
        phone: to,
        message: [title, description, footer].filter(Boolean).join('\n\n'),
        buttons: buttons.map(({ id, text }) => ({ buttonId: id, label: text }))
      };
      const response = await this.http.post('/v1/message/send-button-list', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Create a group
   * @param {string} name - Group name
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Group creation result
   */
  async createGroup(name, participants) {
    try {
      const data = { groupName: name, participants };
      const response = await this.http.post('/v1/group/create-group', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Add participants to a group
   * @param {string} groupId - Group ID
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Add participants result
   */
  async addGroupParticipants(groupId, participants) {
    try {
      const data = { groupId, phones: participants };
      const response = await this.http.post('/v1/group/add-participant', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Remove participants from a group
   * @param {string} groupId - Group ID
   * @param {Array} participants - Array of phone numbers
   * @returns {Promise} - Remove participants result
   */
  async removeGroupParticipants(groupId, participants) {
    try {
      const data = { groupId, phones: participants };
      const response = await this.http.post('/v1/group/remove-participant', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get contacts
   * @returns {Promise} - List of contacts
   */
  async getContacts() {
    try {
      const response = await this.http.get('/v1/contacts/contacts/fetch-contacts');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Get chats
   * @returns {Promise} - List of chats
   */
  async getChats() {
    try {
      const response = await this.http.get('/v1/chats/fetch-chats');
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Error handler
   * @param {Error} error - Error object
   */
  _handleError(error) {
    if (error.response) {
      // Server responded with non-2xx status
      throw new Error(`W-API Error: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Request was made but no response
      throw new Error('W-API Error: No response received from server');
    } else {
      // Error in setting up the request
      throw new Error(`W-API Error: ${error.message}`);
    }
  }
}

module.exports = WApiClient; 