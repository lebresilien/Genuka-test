"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type List = {
  slug: string
  name: string
  selected: boolean
}

type Task = {
  name: string
  category: string
  status: string
  date: string
}

const navigationList = [
  {
    slug: 'messages',
    name: 'messages',
    selected: true
  },
  {
    slug: 'today',
    name: 'today\'s task',
    selected: false
  }, 
  {
    slug: 'activity',
    name: 'last activity',
    selected: false
  }
];

const statusList = [
  {
    name: 'All',
    default: true
  },
  {
    name: 'Open',
    default: false
  },
  {
    name: 'Closed',

    default: false
  },
  {
    name: 'Archived',
    default: false
  }
]

const NavigationItem = ({
  slug, 
  name, 
  selected,
  list,
  setList,
  setCurrentDisplay
}: {
  slug: string, 
  name: string, 
  selected: boolean,
  list: List[],
  setList: (list: List[]) => void,
  setCurrentDisplay: (value: string) => void,
}) => {

  const onPress = (slug: string) => {

    const copyList = [...list];

    const currentSelectedItem = copyList.find((item) => item.slug === slug);
    const otherItem = copyList.filter((item) => item.slug !== slug);
   
    if(currentSelectedItem && otherItem) {
      currentSelectedItem.selected = true;
      for(const item of otherItem) {
        item.selected = false;
      }
      setList(copyList);
      setCurrentDisplay(slug);
    }
  }

  return (
    <div 
      className={cn("border-b-2 border-b-secondary p-5", selected && "border-b-black")}
      onClick={() => onPress(slug)}
    >
      <span className={cn(
        "capitalize cursor-pointer", 
        selected && "font-bold",
        !selected && "hover:font-light"
      )}
      >
        {name}
      </span> 
    </div>
  )
}

const Navigation = ({ 
  list, 
  setList,
  setCurrentDisplay
}: {
  list: List[], 
  setList: (list: List[]) => void,
  setCurrentDisplay: (value: string) => void,
}) => {
  return (
    <div className="flex flex-row justify-space-between aligns-center">
      {
        list.map((item) => (
          <NavigationItem 
            key={item.slug}
            slug={item.slug}
            name={item.name}
            selected={item.selected}
            list={list}
            setList={setList}
            setCurrentDisplay={setCurrentDisplay}            
          />
        ))
      }
    </div>
  )
}

const Checkbox = ({ checked }: ({ checked: boolean })) => (
  <div className="relative">
    <div 
      className={cn(
        "flex h-8 w-8 rounded-full",
        checked ? "bg-primary" : "border-muted border-2"
      )}
    ></div>
    {checked && ((
      <div className="absolute inset-0 left-1 top-1" onClick={() => {} }>
        <CheckIcon className="h-6 w-6 text-white" />
      </div>
    ))}
  </div>
)

const TaskCard = ({ name, category, date, status, tasks, setTasks } : {
  name: string,
  category: string,
  date: string,
  status: string,
  tasks: Task[],
  setTasks: (t: Task[]) => void
}) => {
  const closeTask = (name: string) => {
      const cop = [...tasks];
      const result = cop.find((item) => item.name === name);
      console.log('yee', result)
      if(result) {
        result.status = "Closed";
        setTasks(cop);
      }
  }

  return (
    <div className="flex flex-col bg-white p-5 rounded-lg cursor-pointer">
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xl tracking-wider font-black">{name}</span>
          <span className="text-muted">{category}</span>
        </div>
        <div onClick={() => closeTask(name)}>
          <Checkbox checked={status === "Closed" ? true : false} />
        </div>
      </div>

      <Separator className="my-4"/>

      <div className="flex justify-between items-center">
        <span className="text-muted">{date} </span>
        <div className="">vieueueueu</div>
      </div>
      
    </div>
  )
}

const DialogForm = ({ 
  tasks, 
  setTasks
}: { 
  tasks: Task[], 
  setTasks: (t: Task[]) => void  
}) => {

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);

  const date = new Date();

  const save = () => {
  
    setTasks([
      ...tasks,
      {
        name: name,
        category: category,
        date: date.toLocaleDateString(),
        status: ''
      }
    ]);
    setName('');

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="text-primary tracking-wide capitalize group-hover:font-light">+ new task</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Fill the fields to create a new tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input value={name} placeholder="Add" className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Category
            </Label>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dev" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dev">Dev</SelectItem>
                <SelectItem value="Devops">Devops</SelectItem>
                <SelectItem value="ci/cd">ci/cd</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) 
}

export default function Home() {
  
  const [listNav, setListNav] = useState<List[]>(navigationList);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState('messages');
  
  const status = statusList;
  const today = new Date();

  const formatDate = (date: Date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
  
    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-secondary">
      <main className="flex flex-col row-start-2 items-center sm:items-start bg-white rounded-lg p-10">
        
        <Navigation 
          list={listNav} 
          setList={setListNav} 
          setCurrentDisplay={setCurrentDisplay}
        />

        <div className="w-full bg-secondary py-10 px-5">
          {currentDisplay === "messages" && ((
            <div className="">messages</div>
          ))}
          {currentDisplay === "today" && ((
            <div className="flex flex-col gap-8">

              <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-xl capitalize font-bold tracking-wide">today&apos;s task</span>
                  <span className="text-muted">{formatDate(today)}</span>
                </div>
                <div className="flex rounded-full p-2 items-center bg-blue-300 cursor-pointer group">
                  <DialogForm tasks={tasks} setTasks={setTasks} />
                </div>
              </div>

              <div className="flex justify-between items-center gap-5">
                {status.map((item, index) => (
                  <div 
                    className="flex items-center justify-center space-x-2 cursor-pointer group" 
                    key={index}
                  >
                    <span className={cn("group-hover:font-light", item.default && "text-primary")}>{item.name}</span>
                    <Badge
                      className={cn("text-white", !item.default && "bg-muted")}
                      variant={!item.default ? "secondary" : "default"}
                    >
                      {item.name === "All" && tasks.length}
                      {item.name === "Open" && ((
                        tasks.filter((item) => item.status === "Open").length
                      ))}
                      {item.name === "Closed" && tasks.filter((item) => item.status === "Closed").length}
                      {item.name === "Archived" && tasks.filter((item) => item.status === "Archived").length}
                    </Badge>
                  </div>
                ))}
              </div>

              {tasks.map((item, index) => (
                <TaskCard
                  name={item.name}
                  category={item.category}
                  status={item.status}
                  date={item.date}
                  key={index}
                  tasks={tasks}
                  setTasks={setTasks}
                />
              ))}

            </div>
          ))}
          {currentDisplay === "activity" && ((
            <div className="">Activity</div>
          ))}
        </div>

      </main>
    </div>
  );
}
