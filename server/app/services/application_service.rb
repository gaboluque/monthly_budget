class ApplicationService
  def self.call(*args, &block)
    new(*args, &block).call
  rescue StandardError => e
    { success: false, errors: e.message }
  end
end
