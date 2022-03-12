const About = () => {
  return (
    <div className="container my-4 py-4">
      <div className="row">
        <div className="col-md-6">
          <img src="/assets/about.jpg" alt="About" className="w-75 mt-5" />
        </div>
        <div className="col-md-6">
          <h1 className="display-6 mb-2">Who <b>We</b> Are</h1>
          <hr className="w-50"/>
          <p className="lead mb-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi odit dolorum, necessitatibus dignissimos reprehenderit dicta id rem. Exercitationem soluta ipsam necessitatibus aliquid totam recusandae a alias optio eum quas, corrupti ducimus cupiditate aut adipisci eos tempora quam similique nemo quo, vel dicta blanditiis. Esse magnam laudantium officiis et sed quis?</p>
          <a className="btn btn-primary rounded-pill px-4 py-2" href="/books">Get Started</a>
        </div>
      </div>
    </div>
  );
}

export default About;
