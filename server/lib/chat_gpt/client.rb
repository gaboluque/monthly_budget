require "httparty"
require "json"

module ChatGpt
  class Client
    include HTTParty
    base_uri "https://api.openai.com/v1"

    def initialize(api_key = nil)
      @api_key = api_key || ENV["OPENAI_API_KEY"]
      raise "OpenAI API key is required" unless @api_key

      self.class.default_options.merge!(
        headers: {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{@api_key}"
        }
      )
    end

    def get_completion(messages, model: "gpt-4o")
      response = self.class.post(
        "/chat/completions",
        body: {
          model: model,
          messages: messages,
        }.to_json
      )

      handle_response(response)
    end

    private

    def handle_response(response)
      case response.code
      when 200
        parsed_response = JSON.parse(response.body)
        parsed_response.dig("choices", 0, "message", "content")
      when 401
        raise "Invalid API key"
      when 429
        raise "Rate limit exceeded"
      else
        raise "OpenAI API error: #{response.code} - #{response.body}"
      end
    end
  end
end
