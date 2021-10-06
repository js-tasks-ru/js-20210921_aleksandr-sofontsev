export default class NotificationMessage {

  static singleton = {};

  constructor (mess, {
    duration = 0,
    type = '',
  } = {}) {
    this.mess = mess;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getTemplate () {
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

  render () {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  show() {
    if (Object.keys(NotificationMessage.singleton).length) {
      NotificationMessage.singleton.destroy();
    }

    document.body.append(this.element);
    NotificationMessage.singleton = this;
    setTimeout(() => {this.destroy()}, this.duration);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
