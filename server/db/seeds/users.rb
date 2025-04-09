
class Seeds
  module Users
    def self.run
      puts "\n============ Starting Users Seeding Process ============\n\n"
      create_users
    end

    def self.create_users
      user_emails = %w[
        gabo@test.com
        niko297@hotmail.com
        chisco94@gmail.com
        rafaelmarqueza18@gmail.com
        castaneda.manuel.j@gmail.com
        dpavam@outlook.com
        schrader0216@gmail.com
        jf.rodriguezh97@gmail.com
        manuelmonsalve15@gmail.com
        sebaspinto@gmail.com
        carlosasq96@hotmail.com
        adaniela0307@gmail.com
      ]

      user_emails.each do |email|
        ::Users::Create.call({
          email: email,
          password: email
        })
      end
    end
  end
end

# Seeds::Users.run