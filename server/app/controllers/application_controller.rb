class ApplicationController < ActionController::API
  include JsonWebToken

  rescue_from StandardError do |e|
    render_error(e.message, :internal_server_error)
  end

  private

  def render_error(message, status)
    render json: { error: message }, status: status
  end
end
