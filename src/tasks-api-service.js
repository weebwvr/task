import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TasksApiService extends ApiService {
  get tasks() {
    return this._load({url: 'tasks'})
      .then(ApiService.parseResponse);
  }

  updateTask = async (task) => {
    const response = await this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addTask = async (task) => {
    const response = await this._load({
      url: 'tasks',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(task)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteTask = async (task) => {
    const response = await this._load({
      url: `tasks/${task.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptToServer = (task) => {
    const adaptedTask = {...task,
      'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
      'is_archived': task.isArchive,
      'is_favorite': task.isFavorite,
      'repeating_days': task.repeating,
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  };
}
