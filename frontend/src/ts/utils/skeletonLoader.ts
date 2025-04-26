export default class SkeletonLoader {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  private createSkeletons(): HTMLElement[] {
    const skeletons: HTMLElement[] = [];

    Array.from(this.container.children).forEach((child) => {
      const rect = child.getBoundingClientRect();

      const skeleton = document.createElement("div");
      skeleton.classList.add("skeleton");

      skeleton.style.width = `${rect.width}px`;
      skeleton.style.height = `${rect.height}px`;

      skeletons.push(skeleton);
    });

    return skeletons;
  }

  show(): void {
    this.container.innerHTML = "";

    const skeletons = this.createSkeletons();
    skeletons.forEach((skeleton) => this.container.appendChild(skeleton));
  }

  hide(): void {
    this.container
      .querySelectorAll(".skeleton")
      .forEach((skeleton) => skeleton.remove());
  }
}
