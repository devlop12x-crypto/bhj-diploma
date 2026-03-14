/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
    /**
     * Указываем базовый URL для всех запросов с транзакциями
     */
    static URL = '/transaction';
}