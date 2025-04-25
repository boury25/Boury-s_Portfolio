import { Component, AfterViewInit, OnInit } from '@angular/core';

declare var Swiper: any;
declare var emailjs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  isDesigner = false;
  swiper: any;
  modalSwiper: any;
  allProjects: any[] = [];

  devSkills = [
    { icon: 'fab fa-angular', name: 'Angular' },
    { icon: 'fab fa-java', name: 'Java' },
    { icon: 'fas fa-code', name: 'C++' },
    { icon: 'fas fa-fire', name: 'Firebase' },
    { icon: 'fas fa-database', name: 'SQL' },
    { icon: 'fab fa-python', name: 'Python' },
    { icon: 'fab fa-html5', name: 'HTML' },
    { icon: 'fab fa-css3-alt', name: 'CSS' },
    { icon: 'fas fa-brain', name: 'ML' },
    { icon: 'fas fa-robot', name: 'DL' },
    { icon: 'fas fa-mobile-alt', name: 'Flutter' }
  ];

  designerSkills = [
    { icon: 'fas fa-pen-nib', name: 'Photoshop' },
    { icon: 'fas fa-vector-square', name: 'Illustrator' },
    { icon: 'fab fa-figma', name: 'Figma' },
    { icon: 'fas fa-palette', name: 'Branding' },
    { icon: 'fas fa-bullhorn', name: 'Social Media' }
  ];

  devAbout = {
    description: "I'm a Full-Stack Developer with solid experience in crafting responsive, scalable web applications.",
    image: "assets/profile2.jpeg"
  };

  designerAbout = {
    description: "I'm a Creative Designer who loves crafting unique and engaging visual stories.",
    image: "assets/profile.jpeg"
  };

  ngOnInit(): void {
    emailjs.init("cfXh1U3O48sWMplOy");
  }

  ngAfterViewInit(): void {
    this.setupContactForm();
    this.setupEscapeKey();
    this.updateAbout(this.devAbout);
    this.updateSkills(this.devSkills);
    this.fetchProjects();
  }

  toggleMode(): void {
    this.isDesigner = !this.isDesigner;
    const slider = document.getElementById('slider');
    if (slider) slider.style.transform = this.isDesigner ? 'translateX(100%)' : 'translateX(0)';

    const nicknamePath = document.getElementById('nicknamePath');
    const body = document.body;
    const elements = [
      document.querySelector('header'),
      document.querySelector('.hero'),
      document.querySelector('footer'),
      document.querySelector('.logo'),
      document.querySelector('.edu-card'),
      document.querySelector('.edu-icon')
    ];

    body.classList.toggle('graphic-mode', this.isDesigner);
    body.classList.toggle('dev-animate', !this.isDesigner);

    elements.forEach(el => el?.classList.toggle('graphic-mode', this.isDesigner));
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.toggle('graphic-mode', this.isDesigner));

    if (nicknamePath) {
      nicknamePath.setAttribute('stroke', this.isDesigner ? 'url(#designer-gradient)' : 'url(#custom-gradient)');
      nicknamePath.classList.toggle('graphic-mode', this.isDesigner);
    }

    const roleText = document.getElementById('roleText');
    if (roleText) {
      roleText.textContent = this.isDesigner
        ? "A Creative Graphic Designer passionate about innovative design solutions."
        : "A Full-Stack Developer dedicated to crafting impactful web experiences.";
    }

    this.updateSkills(this.isDesigner ? this.designerSkills : this.devSkills);
    this.updateAbout(this.isDesigner ? this.designerAbout : this.devAbout);
    this.renderCurrentModeProjects();
  }

  toggleEduCard(): void {
    const eduDetails = document.getElementById('eduDetails');
    if (eduDetails) eduDetails.classList.toggle('hidden');
  }

  closeModal(event?: any): void {
    const modal = document.getElementById('projectModal');
    if (modal && (!event || event.target === modal)) {
      modal.classList.remove('show');
    }
  }

  setupContactForm(): void {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      emailjs.sendForm('service_4n1gvr3', 'template_cfksccn', form)
        .then(() => {
          status.textContent = "Message sent successfully!";
          form.reset();
        })
        .catch(() => {
          status.textContent = "Failed to send message. Please try again.";
        });
    });
  }

  setupEscapeKey(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  fetchProjects(): void {
    fetch('assets/projects.json')
      .then(res => res.json())
      .then(data => {
        this.allProjects = data;
        this.renderCurrentModeProjects();
      })
      .catch(err => console.error('Error loading projects:', err));
  }

  renderCurrentModeProjects(): void { 
    const filtered = this.allProjects.filter(p => p.type === (this.isDesigner ? 'design' : 'dev'));
    this.renderProjects(filtered);
  }

  renderProjects(projects: any[]): void {
    const wrapper = document.getElementById('projects-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    projects.forEach((project, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.onclick = () => this.openProjectModal(index, projects);

      const skillsHTML = project.skills.map((s: string) => `<span>${s}</span>`).join('');
      slide.innerHTML = `
        <div class="project-card">
          <div class="project-image"><img src="${project.images[0]}" alt="${project.title}"></div>
          <div class="project-content">
            <h3>${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-skills">${skillsHTML}</div>
          </div>
        </div>
      `;
      wrapper.appendChild(slide);
    });

    if (this.swiper && typeof this.swiper.destroy === 'function') {
      this.swiper.destroy(true, true);
    }

    this.swiper = new Swiper('.swiper-container', {
      direction: 'vertical',
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false }
    });
  }

  openProjectModal(index: number, projects: any[]): void {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalSkills = document.getElementById('modalSkills');
    const modalImages = document.getElementById('modalImages');

    const project = projects[index];
    if (!modal || !modalTitle || !modalDescription || !modalSkills || !modalImages) return;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalSkills.innerHTML = project.skills.map((s: string) => `<span>${s}</span>`).join('');
    modalImages.innerHTML = project.images.map((img: string) => `<div class=\"swiper-slide\"><img src=\"${img}\" /></div>`).join('');

    if (this.modalSwiper) this.modalSwiper.destroy();
    this.modalSwiper = new Swiper('.modal-swiper', {
      direction: 'vertical',
      loop: true,
      pagination: { el: '.modal .swiper-pagination', clickable: true }
    });

    modal.classList.add('show');
  }

  updateSkills(skills: any[]): void {
    const skillsEl = document.getElementById('skills');
    if (!skillsEl) return;
    skillsEl.innerHTML = '';

    skills.forEach(skill => {
      const div = document.createElement('div');
      div.className = 'skill-icon';
      div.setAttribute('data-name', skill.name);
      div.innerHTML = `<i class="${skill.icon}"></i>`;
      skillsEl.appendChild(div);
    });
  }

  updateAbout(content: { description: string; image: string }): void {
    const aboutDesc = document.getElementById('about-description');
    const aboutImg = document.getElementById('about-img') as HTMLImageElement;
    if (aboutDesc) aboutDesc.textContent = content.description;
    if (aboutImg) aboutImg.src = content.image;
  }
}
