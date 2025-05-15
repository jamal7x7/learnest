import { useEffect } from 'react';
import { z } from 'zod'
import { sidebarData } from '~/components/layout/data/sidebar-data'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { useSidebarVisibility } from '~/context/sidebar-visibility-context'

const allSidebarItems: { id: string; label: string }[] = []
sidebarData.navGroups.forEach((group) => {
  group.items.forEach((item) => {
    if (item.title) {
      allSidebarItems.push({ id: item.title, label: item.title })
    }
    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.title) {
          allSidebarItems.push({ id: subItem.title, label: subItem.title })
        }
      })
    }
  })
})

const items = allSidebarItems

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
export function DisplayForm() {
  const { visibleItems, setVisibleItems } = useSidebarVisibility();

  const defaultValues: Partial<DisplayFormValues> = {
    items: visibleItems,
  };

  const form = useForm<DisplayFormValues>({
    defaultValues,
    onSubmit: async ({ value }) => {
      setVisibleItems(value.items);
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: displayFormSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className='space-y-8'
    >
      <form.Field
        name='items'
        children={(field) => (
          <div>
            <div className='mb-4'>
              <Label className='text-base'>Sidebar</Label>
              <p className='text-sm text-muted-foreground'>
                Select the items you want to display in the sidebar.
              </p>
            </div>
            {items.map((item) => {
              const currentSelectedItems = Array.isArray(field.state.value) ? field.state.value : [];
              return (
                <div
                  key={item.id}
                  className='flex flex-row items-start space-y-0 space-x-3 mb-2'
                >
                  <Checkbox
                    id={`checkbox-${item.id}`}
                    checked={currentSelectedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      let newSelectedItems: string[];
                      if (checked) {
                        newSelectedItems = [...currentSelectedItems, item.id];
                      } else {
                        newSelectedItems = currentSelectedItems.filter(
                          (value) => value !== item.id
                        );
                      }
                      field.handleChange(newSelectedItems);
                    }}
                  />
                  <Label htmlFor={`checkbox-${item.id}`} className='font-normal'>
                    {item.label}
                  </Label>
                </div>
              );
            })}
            {field.state.meta.touchedErrors || field.state.meta.errors ? (
              <p className='text-sm font-medium text-destructive'>
                {(field.state.meta.touchedErrors || field.state.meta.errors || []).join(', ')}
              </p>
            ) : null}
          </div>
        )}
      />
      <Button type='submit' disabled={form.state.isSubmitting}>Update display</Button>
    </form>
  )
}
