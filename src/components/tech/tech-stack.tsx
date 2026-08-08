import { Coffee, Layers, Cpu, Code, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabs = [
  {
    title: 'diario',
    icon: Coffee,
    content:
      'Piezas de hardware, atajos de teclado y nuevas ideas para la mañana: esta pestaña agrupa recursos cotidianos que uso para avanzar en la jornada sin perder el ritmo.',
    items: [
      { item: 'Rutina de arranque' },
      { item: 'Apps de notas' },
      { item: 'Widgets útiles' },
    ],
  },
  {
    title: 'equipo',
    icon: Cpu,
    content:
      'Procesadores, estaciones de trabajo y setups colaborativos: aquí describo el equipo técnico que me permite ejecutar proyectos complejos con estabilidad y velocidad.',
    items: [
      { item: 'Monitor ultrawide' },
      { item: 'Teclado mecánico' },
      { item: 'Batería de respaldo' },
    ],
  },
  {
    title: 'software',
    icon: Layers,
    content:
      'Aplicaciones, frameworks y herramientas de productividad: este espacio recoge las soluciones digitales que utilizo para diseñar, desarrollar y mantener el flujo de trabajo.',
    items: [
      { item: 'Editor de código' },
      { item: 'Gestor de proyectos' },
      { item: 'Automatización de tareas' },
    ],
  },
  {
    title: 'código',
    icon: Code,
    content:
      'Líneas de código, patrones de arquitectura y buenas prácticas: en esta pestaña comparto la lógica que da forma a mis proyectos y cómo mantenerla limpia y escalable.',
    items: [
      { item: 'Componentes reutilizables' },
      { item: 'Pruebas unitarias' },
      { item: 'Revisión de Pull Request' },
    ],
  },
  {
    title: 'podcast',
    icon: Mic,
    content:
      'Charlas, entrevistas y episodios inspiradores: aquí comparto los podcasts que escucho para aprender sobre tecnología, diseño y tendencias del sector.',
    items: [
      { item: 'Episodios semanales' },
      { item: 'Invitados destacados' },
      { item: 'Temas de diseño' },
    ],
  },
]

const TechStack = () => {
  return (
    <Tabs
      className="flex w-full flex-col items-start gap-4"
      defaultValue={tabs[0].title}
      orientation="vertical"
    >
      <TabsList className="flex h-auto shrink-0 flex-wrap overflow-hidden border bg-transparent p-0">
        {tabs.map((item) => (
          <TabsTrigger
            className={cn(
              'bg-background/40 hover:bg-muted/20 hover:text-foreground h-auto grow rounded-none p-4 backdrop-blur-xl',
              'data-[state=active]:bg-muted/20',
            )}
            key={item.title}
            value={item.title}
          >
            <item.icon className="h-4 w-4" />{' '}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="bg-background/40 flex rounded-lg border p-4 backdrop-blur-xl">
        {tabs.map((item) => (
          <TabsContent key={item.title} value={item.title} className="m-0">
            <div className="min-w-full">
              <div className="prose">
                <h4 className="capitalize">{item.title}</h4>
                <p>{item.content}</p>
                {item.items && (
                  <ul className="mb-0 list-disc">
                    {item.items.map((subItem) => (
                      <li key={subItem.item} className="text-sm">
                        {subItem.item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

export default TechStack
