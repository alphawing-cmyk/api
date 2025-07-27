import { Switch } from "~/components/ui/switch"
import { Lightbulb, Moon } from "lucide-react"
import { Theme, useTheme } from "remix-themes"
import { useEffect, useState } from "react";

export function ThemeBtn() {
  const [theme, setTheme] = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(()=>{
    if(theme === 'dark'){
      setChecked(true);
    }
  },[]);

  const handleChecked = (checked: boolean) => {
    if (checked === true) {
      setTheme(Theme.DARK);
    } else {
      setTheme(Theme.LIGHT);
    }
    setChecked(checked);
  }

  return (
    <div className="flex items-center space-x-2 mr-2">
      <Lightbulb size={20} />
      <Switch id="airplane-mode" checked={checked} onCheckedChange={handleChecked} />
      <Moon size={20} />
    </div>
  )
}
