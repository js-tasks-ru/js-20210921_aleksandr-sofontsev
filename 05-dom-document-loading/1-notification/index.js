export default class NotificationMessage {

  static prevObj = {};

  constructor(mess, {
    duration = 0,
    type = '',
  } = {}) {
    this.mess = mess;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
        <div class="notification ${this.type}" style="--value:${this.duration}ms">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.mess}
                </div>
            </div>
        </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(elem = document.body) {
    if (Object.keys(NotificationMessage.prevObj).length) {
      NotificationMessage.prevObj.destroy();
    }

    elem.append(this.element);
    NotificationMessage.prevObj = this;
    setTimeout(() => {this.destroy();}, this.duration);
  }

  remove(target = document.body) {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
