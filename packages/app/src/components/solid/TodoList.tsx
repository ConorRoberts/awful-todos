import type { Todo } from "common/schema";
import { createResource, createSignal, type Component } from "solid-js";
import { cn } from "~/utils/shadcn-ui";
import { api } from "~/utils/trpc/trpc-client";
import { AiOutlineClose } from "solid-icons/ai";

export const TodoList: Component<{ todos: Todo[] }> = (props) => {
  const [data, { mutate }] = createResource(() => api.todos.list.query(), { initialValue: props.todos });

  const handleCreateTodo = async () => {
    const newTodo = await api.todos.create.mutate();
    mutate([...data(), newTodo]);
  };

  const updateTodo = async (args: { id: string; name: string; isComplete: boolean }) => {
    mutate((prev) => prev.map((e) => (e.id === args.id ? { ...e, name: args.name, isComplete: args.isComplete } : e)));
    await api.todos.update.mutate(args);
  };

  const deleteTodo = async (args: { id: string }) => {
    mutate((prev) => prev.filter((e) => e.id !== args.id));
    await api.todos.delete.mutate(args);
  };

  const incompleteTodos = () => data().filter((e) => e.isComplete === false);
  const completeTodos = () => data().filter((e) => e.isComplete === true);

  return (
    <div class="relative mx-auto my-8 flex w-full max-w-lg flex-col gap-4">
      <div class="fixed bottom-4 left-1/2 w-max -translate-x-1/2">
        <button
          onClick={() => handleCreateTodo()}
          class="bg-opacity/50 rounded-full border border-gray-200 px-4 py-1 font-medium backdrop-blur"
        >
          Create
        </button>
      </div>
      {incompleteTodos().length === 0 && completeTodos().length === 0 && (
        <p class="mb-1 text-center text-sm font-medium">None</p>
      )}
      {incompleteTodos().length > 0 && (
        <div>
          <p class="mb-1 text-center text-sm font-medium">Todo</p>
          <div class="flex flex-col divide-y divide-gray-100 rounded-md bg-gray-50">
            {incompleteTodos().map((e) => (
              <TodoItem
                data={e}
                onChange={(values) => updateTodo({ name: values.name, id: e.id, isComplete: values.isComplete })}
                onDelete={(values) => deleteTodo(values)}
              />
            ))}
          </div>
        </div>
      )}

      {completeTodos().length > 0 && (
        <div>
          <p class="mb-1 text-center text-sm font-medium">Complete</p>
          <div class="flex flex-col divide-y divide-gray-100 rounded-md bg-gray-50">
            {completeTodos().map((e) => (
              <TodoItem
                data={e}
                onChange={(values) => updateTodo({ name: values.name, id: e.id, isComplete: values.isComplete })}
                onDelete={(values) => deleteTodo(values)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TodoItem: Component<{
  data: Todo;
  onChange: (args: { isComplete: boolean; name: string }) => void;
  onDelete: (args: { id: string }) => void;
}> = (props) => {
  const [draft, setDraft] = createSignal(props.data.name);

  return (
    <div class="flex h-8 items-center gap-4 px-4">
      <button
        class={cn("rounded-full w-4 h-4 border border-gray-300 flex items-center justify-center")}
        onClick={() => props.onChange({ isComplete: !props.data.isComplete, name: draft() })}
      >
        {props.data.isComplete && <div class="h-3 w-3 rounded-full bg-sky-300"></div>}
      </button>
      <input
        value={draft()}
        onInput={(e) => {
          setDraft(e.target.value);
        }}
        onChange={() => {
          props.onChange({ isComplete: props.data.isComplete, name: draft() });
        }}
        class="h-full flex-1 whitespace-pre bg-transparent focus:outline-none"
      />
      <button
        class={cn("rounded-full w-4 h-4 flex items-center justify-center")}
        onClick={() => props.onDelete({ id: props.data.id })}
      >
        <AiOutlineClose class="h-3 w-3 text-gray-500" />
      </button>
    </div>
  );
};
