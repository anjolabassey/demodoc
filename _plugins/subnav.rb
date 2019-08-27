class MySubnavGenerator < Jekyll::Generator
  def generate(site)
    site.pages.each do |page|
      puts page.data["title"]
    end
  end
end